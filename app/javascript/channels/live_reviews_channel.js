import consumer from "./consumer"

export const liveReviewsConsumer = ({onConnected, onDisconnected, onDataReceived}) => {
    consumer.subscriptions.create("LiveReviewsChannel", {
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
