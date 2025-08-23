import React, { useState } from "react";
import { ArrowUp, ArrowDown, MessageSquare } from "react-feather";

function Event({ event, timestamp }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isClient = event.event_id && !event.event_id.startsWith("event_");
  
  // 只检查 response.text.done 事件
  const isResponseTextDone = event.type === "response.text.done";

  // 提取文本内容
  const getTextContent = () => {
    if (isResponseTextDone && event.response?.output?.[0]?.text) {
      console.log(event.response.output[0].text);
      return event.response.output[0].text;
    }
    return null;
  };
// if(isResponseTextDone){
//   const textContent = getTextContent();
//   console.log(textContent);
// }
  return (
    <div className="flex flex-col gap-2 p-2 rounded-md bg-gray-50">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isClient ? (
          <ArrowDown className="text-blue-400" />
        ) : isResponseTextDone ? (
          <MessageSquare className="text-green-600" />
        ) : (
          <ArrowUp className="text-green-400" />
        )}
        <div className="text-sm text-gray-500">
          {isClient ? "client:" : "server:"}
          &nbsp;{event.type} | {timestamp}
        </div>
      </div>
      
      {/* 只在 response.text.done 时显示文本内容 */}
      {isResponseTextDone && (event?.text || "") && (
        <div className="bg-white border-l-4 border-green-500 p-3 rounded-r-md shadow-sm">
          <div className="text-sm text-gray-700 leading-relaxed">
            {event?.text || ""}
          </div>
        </div>
      )}
    
    </div>
  );
}

export default function EventLog({ events }) {
  // 只过滤出我们想要显示的事件
  const filteredEvents = events.filter(event => {
    // 显示客户端事件
    if (event.event_id && !event.event_id.startsWith("event_")) {
      return true;
    }
    // 只显示 response.text.done 服务器事件
    if (event.type === "response.text.done") {
      return true;
    }
    // 过滤掉所有其他服务器事件
    return false;
  });

  const eventsToDisplay = [];

  filteredEvents.forEach((event) => {
    eventsToDisplay.push(
      <Event key={event.event_id} event={event} timestamp={event.timestamp} />,
    );
  });

  return (
    <div className="flex flex-col gap-2 overflow-x-auto">
      {filteredEvents.length === 0 ? (
        <div className="text-gray-500">Awaiting events...</div>
      ) : (
        eventsToDisplay
      )}
    </div>
  );
}
