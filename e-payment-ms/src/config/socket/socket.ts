// src/socket/socket.ts

import { Server } from "socket.io";

let io: Server;

export const initSocket = (server: any) => {

    io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket) => {

        console.log(
            "Socket connected:",
            socket.id
        );

        socket.on(
            "join-order-room",
            (orderId: string) => {

                socket.join(orderId);

                console.log(
                    `Socket joined room: ${orderId}`
                );
            }
        );

        socket.on("disconnect", () => {

            console.log(
                "Socket disconnected:",
                socket.id
            );
        });
    });

    return io;
};

export const getIO = () => {

    if (!io) {
        throw new Error(
            "Socket.IO not initialized"
        );
    }

    return io;
};