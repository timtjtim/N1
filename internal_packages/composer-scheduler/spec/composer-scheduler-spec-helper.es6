import {
  DatabaseStore,
  DraftStore,
  Message,
  Actions,
  Contact,
} from 'nylas-exports'
import {activate, deactivate} from '../lib/main'
import {PLUGIN_ID} from '../lib/scheduler-constants'

export const DRAFT_CLIENT_ID = "draft-client-id"

// Must be a `function` so `this` can be overridden by caller's `apply`
export const prepareDraft = function prepareDraft() {
  spyOn(NylasEnv, "isMainWindow").andReturn(true);
  spyOn(NylasEnv, "getWindowType").andReturn("root");
  spyOn(Actions, "setMetadata").andCallFake((draft, pluginId, metadata) => {
    if (!this.session) {
      throw new Error("Setup test session first")
    }
    this.session.changes.addPluginMetadata(PLUGIN_ID, metadata);
  })
  activate();

  const draft = new Message({
    clientId: DRAFT_CLIENT_ID,
    draft: true,
    body: "",
    accountId: window.TEST_ACCOUNT_ID,
    from: [new Contact({email: window.TEST_ACCOUNT_EMAIL})],
  })

  spyOn(DatabaseStore, 'run').andReturn(Promise.resolve(draft));

  this.session = null;
  runs(() => {
    DraftStore.sessionForClientId(DRAFT_CLIENT_ID).then((session) => {
      this.session = session
    });
  })
  waitsFor(() => this.session);
}

export const cleanupDraft = function cleanupDraft() {
  DraftStore._cleanupAllSessions()
  deactivate()
}
