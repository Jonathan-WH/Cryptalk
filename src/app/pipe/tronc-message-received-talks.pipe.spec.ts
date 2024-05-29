import { TruncateWordsPipe} from './tronc-message-received-talks.pipe'

describe('TroncMessageReceivedTalksPipe', () => {
  it('create an instance', () => {
    const pipe = new TruncateWordsPipe();
    expect(pipe).toBeTruthy();
  });
});
