
export type AnchorHorizontal = 'left' | 'center' | 'right';
export type AnchorVertical = 'top' | 'bottom';

export default interface IStateAnchorOrigin {
  vertical: AnchorVertical;
  horizontal: AnchorHorizontal;
}
