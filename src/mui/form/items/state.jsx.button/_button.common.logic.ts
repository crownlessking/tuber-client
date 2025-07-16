import type StateFormItem from '../../../../controllers/StateFormItem';

export type TCombinations = 'textrighticon'
| 'textrightfaicon'
| 'textlefticon'
| 'textleftfaicon'
| 'text'
| 'icon'
| 'faicon'
| 'none';

export function get_button_content_code(button: StateFormItem): TCombinations {
  const { has: { iconPosition, icon, faIcon }, text } = button;
  let score = 0;
  if (text) { score += 16; }
  if (iconPosition === 'right') { score += 8; }
  if (iconPosition === 'left') { score += 4; }
  if (icon) {
    score += 2;
  } else if (faIcon) {
    score += 1;
  }
  if (score === 26) return 'textrighticon'; // 16 + 8 + 2
  if (score === 22) return 'textlefticon';  // 16 + 4 + 2
  if (score===25) return 'textrightfaicon'; // 16 + 8 + 1
  if (score=== 21) return 'textleftfaicon'; // 16 + 4 + 1
  if (score === 16) return 'text'; // 16
  if (score === 2) return 'icon'; // 2
  if (score === 1) return 'faicon'; // 1
  return 'none';
}