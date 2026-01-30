class NavigationController {
    startNavigation(details) {
        console.log('Starting navigation:', details);
    }

    stopNavigation() {
        console.log('Stopping navigation');
    }
}

export default new NavigationController();
