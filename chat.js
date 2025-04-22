import {
    createMessage,
    getRoomMembers,
    updateMessageSeenStatusByChatID,
    updateMessageSeenStatusByRoomID,
    unreadChatCount,
    userLogStatus,
    updateMessageByChatID,
    deleteMessageByChatID,
    } from "../utils/chatservices";
    import { sendPushNotification } from "../utils/push-notification";
    export const socketHandler = async (socket) => {
    console.log("Authenticated");
    socket.join(socket.decoded.id);
    socket.emit("connected", `connected id ${socket.decoded.id}`);
    let userStatus = await userLogStatus(socket.decoded.id, true);
    // Message Seen
    socket.on("messageSeen", async (chat) => {
    let res = await updateMessageSeenStatusByChatID(
    chat.messageId,
    socket.decoded.id
    );
    });
    // Room ALL Message Seen //
    socket.on("roomAllMessageSeen", async (room) => {
    let seenMessages = await updateMessageSeenStatusByRoomID(
    room.chatRoomId,
    socket.decoded.id
    );
    unreadCount = await unreadChatCount(socket.decoded.id);
    socket.emit("unreadChatCount", unreadCount);
    socket.emit("roomAllMessageSeen", seenMessages);
    });
    // create Message
    socket.on("createMessage", async (data) => {
    var createMessageData = {
    chatRoomId: data.chatRoomId,
    senderId: socket.decoded.id,
    content: data.message,
    messageType: data.messageType,
    };
    if (data?.file) {
    createMessageData["file"] = data.file;
    }
    let newMessage = await createMessage(createMessageData);
    if (newMessage) {
    newMessage = JSON.stringify(newMessage);
    newMessage = JSON.parse(newMessage);
    }
    let allMembers = await getRoomMembers(data.chatRoomId);
    if (!allMembers) {
    console.error(
    "getRoomMembers returned null for chatRoomId:",
    data.chatRoomId
    );
    return;
    }
    if (String(allMembers?.receiverDetails?.id) !== String(socket.decoded.id)) {
    console.log("Message get to id ======", allMembers?.receiverDetails.id, {
    newMessage,
    });
    socket.to(allMembers.receiverDetails.id).emit("newMessage", newMessage);
    let unreadCount = await unreadChatCount(allMembers.receiverDetails.id);
    socket
    .to(allMembers.receiverDetails.id)
    .emit("unreadChatCount", unreadCount);
    }
    if (String(allMembers?.senderDetails?.id) !== String(socket.decoded.id)) {
    console.log("Message get to id ======", allMembers?.senderDetails.id, {
    newMessage,
    });
    socket.to(allMembers.senderDetails.id).emit("newMessage", newMessage);
    let unreadCount = await unreadChatCount(allMembers.senderDetails.id);
    socket
    .to(allMembers.senderDetails.id)
    .emit("unreadChatCount", unreadCount);
    }
    });
    socket.on("updateMessage", async (data) => {
    await updateMessageByChatID(data, socket.decoded.id);
    });
    socket.on("deleteMessage", async (data) => {
    await deleteMessageByChatID(data, socket.decoded.id);
    });
    //// Message Seen //////////
    socket.on("checkOnline", async (data) => {
    var allMembers = await getRoomMembers(data.chatRoomId);
    if (String(allMembers?.receiverDetails?.id) === String(socket.decoded.id)) {
    let obj = {
    id: allMembers.receiverDetails.id,
    isOnline: allMembers.receiverDetails.isOnline,
    offlineTime: allMembers.receiverDetails.offlineTime,
    };
    socket.emit("userStatusUpdate", obj);
    }
    if (String(allMembers?.senderDetails?.id) === String(socket.decoded.id)) {
    let obj = {
    id: allMembers.senderDetails.id,
    isOnline: allMembers.senderDetails.isOnline,
    offlineTime: allMembers.senderDetails.offlineTime,
    };
    socket.emit("userStatusUpdate", obj);
    }
    });
    let unreadCount = await unreadChatCount(socket.decoded.id);
    // socket.emit("unreadChatCount", unreadCount);
    socket.on("unreadChatCount", async (room) => {
    let unreadCount = await unreadChatCount(socket.decoded.id);
    socket.emit("unreadChatCount", unreadCount);
    });
    // Update userStatus
    socket.on("disconnect", async function () {
    console.log("Got disconnect!");
    let userStatus = await userLogStatus(socket.decoded.id, false);
    socket.emit("userStatusUpdate", userStatus);
    });
    socket.on("join chat", (room) => {
    console.log("joined");
    socket.join(room);
    // console.log("user Joined Room : " ,room)
    });
    };