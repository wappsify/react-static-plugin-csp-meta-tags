import { defaultOptions } from "../helpers/options";
import createPolicyObject from "../helpers/createPolicyObject";

const fakeShas = {
  "style-src": ["fake-sha-1", "fake-sha-2", "fake-sha-3", "fake-sha-4"],
  "script-src": ["fake-sha-15", "fake-sha-6", "fake-sha-7", "fake-sha-8"],
};

const userPolicy = {
  "default-src": `'self'`,
  "object-src": `'none'`,
  "script-src": `'self' 'unsafe-inline'`,
  "style-src": `'self' 'unsafe-inline'`,
  "connect-src": `'self'`,
};

describe("createPolicyObject", () => {
  it("should return defaultOptions.policy object when nothing else is passed", () => {
    expect.assertions(1);
    const policy = createPolicyObject(defaultOptions.policy, {});
    expect(policy).toStrictEqual(defaultOptions.policy);
  });

  it("should merge options policy and shas policy", () => {
    expect.assertions(1);
    const policy = createPolicyObject(defaultOptions.policy, fakeShas);
    expect(policy["style-src"]).toContain("fake-sha-1");
  });

  it("should merge options policy and shas policy even when user supplies own policy", () => {
    expect.assertions(1);
    const policy = createPolicyObject(userPolicy, fakeShas);
    expect(policy["style-src"]).toContain("fake-sha-1");
  });
});
