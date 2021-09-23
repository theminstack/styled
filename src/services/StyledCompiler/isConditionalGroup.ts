export function isConditionalGroup(atRuleKey: string): atRuleKey is '@media' | '@supports' | '@document' {
  return atRuleKey === '@media' || atRuleKey === '@supports' || atRuleKey === '@document';
}
