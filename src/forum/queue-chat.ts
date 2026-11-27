export const PUBLIC_QUEUE_CHAT = "forum_17aa3530-d152-462e-a032-909ae69019ed";
export const SECRET_QUEUE_CHAT = "forum_secret-queue-chat";

export function isQueueChat(threadId: string): boolean {
  return threadId === PUBLIC_QUEUE_CHAT || threadId === SECRET_QUEUE_CHAT;
}
