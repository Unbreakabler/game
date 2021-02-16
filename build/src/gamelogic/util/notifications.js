import { writable } from '../../../node_modules/svelte/store/index.mjs.js';

/**
 * Svelte store to hold an array of messages
 */
const messageQueue = writable([]);
/**
 * How long should each message be displayed in ms
 */
const messageTime = 4000;
/**
 * Used to get a unique id for each message
 */
let idNumber = 0;
/**
 * Simple class to hold a string and an ID used to display messages to the player.
 * This could be expanded to include icons, sound effects, css classes for animations etc.
 */
class Message {
    constructor(message) {
        this.message = message;
        this.id = idNumber++;
    }
}
/**
 * Function to add a message to the message queue
 * @param message Message to be shown to the player
 */
function sendMessage(message) {
    // create a message object
    const notification = new Message(message);
    // add the message to the message queue
    messageQueue.update((m) => (m = [...m, notification]));
    // create a timeout to automatically remove the message after messageTime elapsed
    setTimeout(() => {
        messageQueue.update((m) => (m = m.filter((e) => e.id != notification.id)));
    }, messageTime);
}

export { Message, messageQueue, sendMessage };
//# sourceMappingURL=notifications.js.map
