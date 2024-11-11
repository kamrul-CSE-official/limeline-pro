"use client";

import { useState, useCallback } from "react";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { ZoomIn, ZoomOut } from "lucide-react";
import CustomItemRenderer from "../share/customItemRenderer";
import { IItem } from "@/interface/items";
import { IGroupFormValues } from "@/interface/group";
import ReactCalendarTimeline from "react-calendar-timeline";

export default function Timeline() {
  const [zoom, setZoom] = useState(30 * 24 * 60 * 60 * 1000);
  const [items, setItems] = useState<IItem[]>(() =>
    JSON.parse(localStorage.getItem("items") || "[]")
  );
  const [groups] = useState<IGroupFormValues[]>(() =>
    JSON.parse(localStorage.getItem("groups") || "[]")
  );

  const handleZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const handleSliderChange = useCallback((value: number[]) => {
    const newZoom = Math.exp(value[0]) * 60 * 60 * 1000;
    setZoom(newZoom);
  }, []);

  const handleItemMove = useCallback((itemId, dragTime, newGroup) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId
          ? { ...item, start: dragTime, group: newGroup }
          : item
      )
    );
  }, []);

  const handleItemResize = (
    itemId: number,
    time: number,
    edge: "left" | "right"
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            start_time: edge === "left" ? time : item.start_time,
            end_time: edge === "right" ? time : item.end_time,
          };
        }
        return item;
      })
    );
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Timeline</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleZoomChange(zoom * 1.2)}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleZoomChange(zoom / 1.2)}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Zoom:</span>
            <Slider
              min={0}
              max={Math.log(365 * 24)} // Log of max zoom (1 year)
              step={0.1}
              value={[Math.log(zoom / (60 * 60 * 1000))]}
              onValueChange={handleSliderChange}
              className="flex-grow"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              onClick={() => handleZoomChange(365 * 24 * 60 * 60 * 1000)}
            >
              Year
            </Button>
            <Button
              variant="outline"
              onClick={() => handleZoomChange(30 * 24 * 60 * 60 * 1000)}
            >
              Month
            </Button>
            <Button
              variant="outline"
              onClick={() => handleZoomChange(7 * 24 * 60 * 60 * 1000)}
            >
              Week
            </Button>
            <Button
              variant="outline"
              onClick={() => handleZoomChange(24 * 60 * 60 * 1000)}
            >
              Day
            </Button>
            <Button
              variant="outline"
              onClick={() => handleZoomChange(60 * 60 * 1000)}
            >
              Hour
            </Button>
          </div>
        </div>

        <div className="relative z-0 border rounded-lg overflow-hidden">
          <ReactCalendarTimeline
            groups={groups}
            items={items}
            defaultTimeStart={moment().add(-12, "hour")}
            defaultTimeEnd={moment().add(12, "hour")}
            lineHeight={90}
            itemHeightRatio={0.87}
            itemRenderer={CustomItemRenderer}
            canMove={true}
            canResize={true}
            onItemMove={handleItemMove} // Handle item move
            onItemResize={handleItemResize}
            onTimeChange={(
              visibleTimeStart,
              visibleTimeEnd,
              updateScrollCanvas
            ) => {
              updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
            }}
            minZoom={60 * 60 * 1000} // 1 hour
            maxZoom={365 * 24 * 60 * 60 * 1000} // 1 year
            visibleTimeStart={moment()
              .add(-zoom / 2, "ms")
              .valueOf()}
            visibleTimeEnd={moment()
              .add(zoom / 2, "ms")
              .valueOf()}
          />
        </div>
      </CardContent>
    </Card>
  );
}
