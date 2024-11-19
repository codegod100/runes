import {
    Jetstream
} from "@skyware/jetstream";

export default function () {
    const
        jetstream = new
            Jetstream({ wantedCollections: ['social.psky.chat.message'] });
    return jetstream
}  
