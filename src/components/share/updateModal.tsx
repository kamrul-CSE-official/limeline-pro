import React from "react";
import { Button } from "@/components/ui/button";
import { Edit, Info, Trash, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import moment from "moment";
import { IItem } from "@/interface/items";

interface CustomItemRendererProps {
  item: IItem;
  itemContext: any;
  getItemProps: (props: any) => any;
}

const UpdateItemModal: React.FC<CustomItemRendererProps> = ({
  item,
  itemContext,
  getItemProps,
}) => {
  const handleButtonClick = (itemId: number, action: string) => {
    alert(`${action} clicked for item ${itemId}`);
  };
  console.log("custom items: ", item, itemContext, getItemProps);
  // Calculate progress based on current time within the item's time range
  const startTime = moment(item.start_time);
  const endTime = moment(item.end_time);
  const currentTime = moment();

  const totalDuration = endTime.diff(startTime);
  const durationInHours = moment.duration(totalDuration).asHours();
  const elapsedDuration = currentTime.isAfter(startTime)
    ? currentTime.diff(startTime)
    : 0;
  const progress = Math.min((elapsedDuration / totalDuration) * 100, 100);

  const isActive = currentTime.isBetween(startTime, endTime);

  const getStatusColor = () => {
    if (currentTime.isBefore(startTime)) return "bg-yellow-500";
    if (isActive) return "bg-green-500";
    return "bg-gray-500";
  };

  const getStatusText = () => {
    if (currentTime.isBefore(startTime)) return "Upcoming";
    if (isActive) return "Active";
    return "Completed";
  };

  const radius = 40;
  const circumference = radius * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  console.log(durationInHours);

  const allItems = JSON.parse(localStorage.getItem("items") || "[]");
  const handleDeleteItem = (id: number) => {
    const othersItems = allItems.filter((item: IItem) => item.id !== id);
    localStorage.setItem("items", JSON.stringify(othersItems));
  };

  return (
    <TooltipProvider>
      <div
        {...getItemProps({
          style: {
            // backgroundColor: "#f3f4f6",
            backgroundColor: `${item?.style?.backgroundColor}` || "#f3f4f6",
            color: "#1f2937",
            borderRadius: "8px",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          },
        })}
        className="p-3 flex flex-col justify-between h-full transition-all duration-200 hover:shadow-lg"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-sm truncate mr-2">
            {item.title}
          </span>
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="outline"
                className={`text-xs ${getStatusColor()} text-white`}
              >
                {getStatusText()}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Status: {getStatusText()}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs">
            <Clock className="w-3 h-3" />
            <div className="text-xs opacity-75">
              {moment(item.start_time).format("HH:mm")} -{" "}
              {moment(item.end_time).format("HH:mm")}
            </div>
            {/* ({durationInHours}) */}
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative w-16 h-8">
                <svg className="w-full h-full" viewBox="0 0 100 50">
                  <path
                    d="M5 50 A45 45 0 0 1 95 50"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="10"
                  />
                  <path
                    d="M5 50 A45 45 0 0 1 95 50"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    className="transition-all duration-500 ease-in-out"
                  />
                  <text
                    x="50"
                    y="55"
                    textAnchor="middle"
                    fontSize="20"
                    fill="#1f2937"
                  >
                    {progress.toFixed(0)}%
                  </text>
                </svg>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{progress.toFixed(0)}% Complete</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex items-center gap-1 mt-2 text-black">
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleButtonClick(item.id, "Edit")}
            className="flex items-center gap-1 p-1 h-7 text-xs hover:bg-blue-100"
          >
            <Edit className="w-3 h-3" />
            Edit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleButtonClick(item.id, "Details")}
            className="flex items-center gap-1 p-1 h-7 text-xs hover:bg-blue-100"
          >
            <Info className="w-3 h-3" />
            Details
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleDeleteItem(item.id)}
            className="flex items-center gap-1 p-1 h-7 text-xs hover:bg-red-100 hover:text-red-600"
          >
            <Trash className="w-3 h-3" />
            Delete
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default UpdateItemModal;
