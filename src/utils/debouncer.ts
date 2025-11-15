import * as d3 from "d3";

export interface InteractionState<T = unknown> {
  element: T;
  type: string;
  metadata?: Record<string, unknown>;
}

export class InteractionDebouncer<T = unknown> {
  private enterTimer: d3.Timer | null = null;
  private leaveTimer: d3.Timer | null = null;
  private currentState: InteractionState<T> | null = null;
  private enterDelay: number;
  private leaveDelay: number;

  constructor(enterDelay = 50, leaveDelay = 100) {
    this.enterDelay = enterDelay;
    this.leaveDelay = leaveDelay;
  }

  // Generic enter method
  onEnter(
    element: T,
    type: string,
    onEnterCallback: (
      element: T,
      type: string,
      metadata?: Record<string, unknown>,
    ) => void,
    metadata?: Record<string, unknown>,
  ) {
    // Clear any pending leave timer
    if (this.leaveTimer) {
      this.leaveTimer.stop();
      this.leaveTimer = null;
    }

    // If already in the same state, don't restart
    if (
      this.currentState &&
      this.currentState.type === type &&
      this.currentState.element === element
    ) {
      return;
    }

    // Clear any pending enter timer
    if (this.enterTimer) {
      this.enterTimer.stop();
    }

    // Debounce enter effect
    this.enterTimer = d3.timeout(() => {
      this.currentState = { element, type, metadata };
      onEnterCallback(element, type, metadata);
      this.enterTimer = null;
    }, this.enterDelay);
  }

  // Generic leave method
  onLeave(onLeaveCallback: (previousState?: InteractionState<T>) => void) {
    // Clear any pending enter timer
    if (this.enterTimer) {
      this.enterTimer.stop();
      this.enterTimer = null;
    }

    // Clear any existing leave timer
    if (this.leaveTimer) {
      this.leaveTimer.stop();
    }

    // Debounce leave effect
    const previousState = this.currentState;
    this.leaveTimer = d3.timeout(() => {
      this.currentState = null;
      onLeaveCallback(previousState ?? undefined);
      this.leaveTimer = null;
    }, this.leaveDelay);
  }

  // Check current state
  isInState(element: T, type: string): boolean {
    return (
      this.currentState?.element === element && this.currentState?.type === type
    );
  }

  getCurrentState(): InteractionState<T> | null {
    return this.currentState;
  }

  // Update delays dynamically
  setDelays(enterDelay: number, leaveDelay: number) {
    this.enterDelay = enterDelay;
    this.leaveDelay = leaveDelay;
  }

  // Cleanup
  cleanup() {
    if (this.enterTimer) {
      this.enterTimer.stop();
      this.enterTimer = null;
    }
    if (this.leaveTimer) {
      this.leaveTimer.stop();
      this.leaveTimer = null;
    }
    this.currentState = null;
  }
}

/**
 * Usage Examples:
 *
 * 1. For hover interactions:
 * ```typescript
 * const hoverDebouncer = new InteractionDebouncer(50, 100);
 *
 * // Mouse enter
 * hoverDebouncer.onEnter(element.data, element.type, applyHoverEffect);
 *
 * // Mouse leave
 * hoverDebouncer.onLeave(clearHoverEffect);
 * ```
 *
 * 2. For click interactions:
 * ```typescript
 * const clickDebouncer = new InteractionDebouncer(0, 200); // No enter delay, 200ms leave delay
 *
 * clickDebouncer.onEnter(node, 'click', (element, type) => {
 *   // Handle click - select node, show details, etc.
 *   console.log('Node clicked:', element);
 * });
 * ```
 *
 * 3. For focus/search interactions:
 * ```typescript
 * const searchDebouncer = new InteractionDebouncer(300, 0); // 300ms enter delay, no leave delay
 *
 * searchDebouncer.onEnter(searchTerm, 'search', (term, type) => {
 *   // Perform search after user stops typing
 *   performSearch(term);
 * });
 * ```
 *
 * 4. For drag interactions:
 * ```typescript
 * const dragDebouncer = new InteractionDebouncer(10, 50);
 *
 * dragDebouncer.onEnter(dragTarget, 'dragover', (element, type, metadata) => {
 *   // Handle drag over with position data
 *   showDropZone(element, metadata?.position);
 * }, { position: { x: event.clientX, y: event.clientY } });
 * ```
 */
