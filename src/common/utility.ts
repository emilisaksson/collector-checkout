import * as crypto from 'crypto';

export default {
    authorizationGenerator: (username : string, accessKey: string) => {
        return (body : string, path: string) => {
            let hash = crypto.createHash('sha256').update(`${body}${path}${accessKey}`).digest('hex');
            return `SharedKey ${Buffer.from(`${username}:${hash}`).toString('base64')}`;
        }
    }
}