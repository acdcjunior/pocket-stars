import $ from "jquery";
import 'jquery-toast-plugin'

export const Toast = {
    displaySuccess(message) {
        $.toast({icon: 'success', text: message, hideAfter : 5000});
    },
    displayInfo(message, hideAfter = 4000) {
        $.toast({icon: 'info', text: message, hideAfter});
    },
    displayError(message, errorResponse) {
        console.error(message, errorResponse);
        const trimmedErrorMessage = ((msg, n) => msg.substr(0, n) + (msg.length > n ? '...' : ''))(errorResponse.responseText || '', 150);
        $.toast({
            icon: 'error',
            text: message + `<br><br>Error: ${trimmedErrorMessage}`,
            hideAfter: false
        });
    }
};
