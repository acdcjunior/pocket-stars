import consumer from "./consumer"

export const liveReviewsConsumer = ({project, onConnected, onDisconnected, onDataReceived}) => {
    consumer.subscriptions.create({channel: "LiveReviewsChannel", project}, {
        connected() {
            onConnected();
        },

        disconnected() {
            onDisconnected();
        },

        received(data) {
            onDataReceived(data);
        }
    });
}
