import store from '.';

/**
 * Temporarily holds the handle id of a `setTimeout` function which has been
 * scheduled to run.
 *
 * The variable's purpose is to prevent functions from running after they have
 * been scheduled to do so via `setTimeout`
 */
let handle: any;

/**
 * We don't want to spinner to show up right away, so we schedule it to appear
 * if a specific operation takes too long.
 *
 * @param time when is the spinner scheduled to appear in milliseconds 
 */
export function schedule_spinner(time = 200): void {
  if (!handle) {
    const callback = () => store.dispatch({ type: 'app/appShowSpinner' });
    handle = setTimeout(callback, time);
    // _auto_hide_spinner()
  }
}

/**
 * Cancels a spinner which was previously scheduled to show.
 *
 * Whenever the app makes an Ajax request, the spinner would flash for a split second.
 * This made for a horrible user experience when paginating through rows of data
 * (the page would constantly flicker).
 * With this function, the spinner will only show when the request takes longer than
 * it should to complete which then prevents the flickering.
 *
 * Note: consider using another type of spinner e.i. the thin spinner bar that
 *       can be placed at the top of the page.
 */
export function cancel_spinner(): void {
  if (handle) {
    clearTimeout(handle);
    handle = null;
  }
}

/** Automatically hide spinner after 10 seconds if it's still spinning. */
export function auto_hide_spinner(): void {
  setTimeout(() => {
    if (store.getState().app.showSpinner) {
      store.dispatch({ type: 'app/appHideSpinner' });
    }
  }, 10000);
}