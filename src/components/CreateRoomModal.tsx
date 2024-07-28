"use client";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Input,
    FormLabel
  } from '@chakra-ui/react'
import { useForm } from "react-hook-form";
import { createRoomSchema, CreateRoomSchema } from "@/schemas/rooms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

export default function CreateRoomModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoomSchema>({
    resolver: zodResolver(createRoomSchema),
    mode: "onSubmit",

    delayError: 100,
  });

  const onSubmit = (data: CreateRoomSchema) => {
    console.log("Formulario enviado con éxito:", data);
  };

  const onError = (error: any) => {
    console.log("Errores de validación:", error);
  };

  useEffect(() => {
    console.log(errors.name, errors.description);
  }, [errors]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>Create a room</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <FormLabel>Nombre de la sala</FormLabel>
            <Input type="text" {...register("name")} />
            {errors.name && (
              <span className="text-red-500">{errors.name.message}eeee</span>
            )}

            <FormLabel>Descripción de la Sala</FormLabel>
            <Input {...register("description")} />
            {(errors.description !== undefined) && (
              <span className="text-red-500">{errors.description?.message}</span>
            )}

            <Button type="submit" mt={4}>
              Crear sala
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
