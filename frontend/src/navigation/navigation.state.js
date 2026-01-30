class NavigationState {
    constructor() {
        this.currentState = 'IDLE'; // IDLE, NAVIGATING, ARRIVED
    }

    setState(state) {
        this.currentState = state;
        console.log('Navigation State updated to:', state);
    }

    getState() {
        return this.currentState;
    }
}

export default new NavigationState();
