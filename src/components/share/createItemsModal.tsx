'use client';

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TimelineGroupBase } from "react-calendar-timeline";
import { RgbColorPicker, RgbColor } from 'react-colorful';
import moment from "moment";
import { CalendarIcon, Clock3Icon } from "lucide-react";
import { IItem } from "@/interface/items";

interface Group extends TimelineGroupBase {
  title: string;
}



interface FormValues {
  title: string;
  group: number;
  start_time: string;
  end_time: string;
  progress: number;
  description?: string;
  priority: 'low' | 'medium' | 'high';
}

const CreateItemsModal = () => {
  const [groups] = useState<Group[]>(JSON.parse(
    localStorage.getItem("groups") || "[]"
  ));

  const [items, setItems] = useState<IItem[]>(JSON.parse(
    localStorage.getItem("items") || "[]"
  ));;
  const [color, setColor] = useState<RgbColor>({ r: 100, g: 100, b: 100 });
  const [isOpen, setIsOpen] = useState(false);

  const { register, handleSubmit, control, reset, formState: { errors }, watch } = useForm<FormValues>();
  const startTime = watch("start_time");

  const onSubmit = (data: FormValues) => {
    const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
    const newScheduleItem: IItem = {
      ...data,
      id: newId,
      group: Number(data.group), 
      start_time: moment(data.start_time).valueOf(),
      end_time: moment(data.end_time).valueOf(),
      canMove: true,
      canResize: "both",
      canChangeGroup: true,
      style: { backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` },
    };
    setItems(prev => [...prev, newScheduleItem]);
    if (newScheduleItem && typeof newScheduleItem === "object") {
      const previousItems = JSON.parse(
        localStorage.getItem("items") || "[]"
      ) as any[]; 
      localStorage.setItem(
        "items",
        JSON.stringify([...previousItems, newScheduleItem])
      );
    } else {
      console.error("Invalid group data");
    }
    reset();
    setIsOpen(false);
  };


  console.log(items);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">Create Schedule</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Schedule Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">Title</Label>
              <Input
                id="title"
                {...register("title", { required: "Title is required" })}
                className="w-full"
              />
              {errors.title && <span className="text-red-500 text-sm">{errors.title.message}</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="group" className="text-sm font-medium">Machine</Label>
              <Controller
                name="group"
                control={control}
                defaultValue={1}
                rules={{ required: "Machine selection is required" }}
                render={({ field }) => (
                  <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a machine" />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={String(group.id)}>
                          {group.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.group && <span className="text-red-500 text-sm">{errors.group.message}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_time" className="text-sm font-medium">Start Time</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="start_time"
                  type="datetime-local"
                  {...register("start_time", { required: "Start Time is required" })}
                  className="pl-10 w-full"
                />
              </div>
              {errors.start_time && <span className="text-red-500 text-sm">{errors.start_time.message}</span>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_time" className="text-sm font-medium">End Time</Label>
              <div className="relative">
                <Clock3Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="end_time"
                  type="datetime-local"
                  {...register("end_time", {
                    required: "End Time is required",
                    validate: (value) =>
                      moment(value).isAfter(moment(startTime)) || "End Time must be after Start Time",
                  })}
                  className="pl-10 w-full"
                />
              </div>
              {errors.end_time && <span className="text-red-500 text-sm">{errors.end_time.message}</span>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="progress" className="text-sm font-medium">Progress</Label>
            <Input
              id="progress"
              type="number"
              {...register("progress", {
                required: "Progress is required",
                min: { value: 0, message: "Progress cannot be less than 0" },
                max: { value: 100, message: "Progress cannot be more than 100" },
              })}
              className="w-full"
            />
            {errors.progress && <span className="text-red-500 text-sm">{errors.progress.message}</span>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              className="w-full min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
              <Controller
                name="priority"
                control={control}
                defaultValue="medium"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Color</Label>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-10 h-10 rounded-full border border-gray-300" 
                  style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }} 
                />
                <RgbColorPicker color={color} onChange={setColor} className="w-full max-w-[180px] max-h-[100px] rounded-2xl" />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">Create Schedule Item</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateItemsModal;
