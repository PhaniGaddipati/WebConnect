/**
 * Created by phani on 1/3/17.
 */
import {WEB_CONNECT_S3_ACCESS_KEY_ID, WEB_CONNECT_S3_SECRET_ACCESS_KEY} from "./keys.js";
;

S3.config = {
    key: WEB_CONNECT_S3_ACCESS_KEY_ID,
    secret: WEB_CONNECT_S3_SECRET_ACCESS_KEY,
    bucket: "tech-connect-user-uploads",
    denyDelete: true
};