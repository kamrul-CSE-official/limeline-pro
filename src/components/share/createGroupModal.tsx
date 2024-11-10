"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IGroupFormValues } from "@/interface/group";

const CreateGroupModal = () => {
  const [groups, setGroups] = useState<any[]>(JSON.parse(
    localStorage.getItem("groups") || "[]"
  ));
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IGroupFormValues>();

  const onSubmit = (data: IGroupFormValues) => {
    // Assuming `groupIdKey` is auto-generated on submission
    const id = groups.length + 1;
    const newGroup = { ...data, groupIdKey: id, id: id }; 
    setGroups((prev) => [...prev, newGroup]);

    if (newGroup && typeof newGroup === "object") {
      const previousGroups = JSON.parse(
        localStorage.getItem("groups") || "[]"
      ) as any[]; 
      localStorage.setItem(
        "groups",
        JSON.stringify([...previousGroups, newGroup])
      );
    } else {
      console.error("Invalid group data");
    }

    reset(); // Reset form after submission
    setIsOpen(false); // Close the modal after submission
  };
  console.log(groups);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto">
          Create Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create New Group
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Group Name */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Group Name
            </Label>
            <Input
              id="title"
              {...register("title", {
                required: "Group name is required",
              })}
              className="w-full"
            />
            {errors.title && (
              <span className="text-red-500 text-sm">
                {errors.title.message}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="itemTitleKey" className="text-sm font-medium">
              Description
            </Label>
            <Input
              id="itemTitleKey"
              {...register("itemTitleKey", {
                required: "Description is required",
              })}
              className="w-full"
            />
            {errors.itemTitleKey && (
              <span className="text-red-500 text-sm">
                {errors.itemTitleKey.message}
              </span>
            )}
          </div>

          <Button type="submit" className="w-full">
            Create Group
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;
