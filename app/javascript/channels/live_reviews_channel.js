import consumer from "./consumer"

export const liveReviewsConsumer = ({product, onConnected, onDisconnected, onDataReceived}) => {
    consumer.subscriptions.create({channel: "LiveReviewsChannel", product}, {
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
