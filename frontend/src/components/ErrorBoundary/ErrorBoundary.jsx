import React from "react";

import { ErrorMessage } from "../ErrorMessage/ErrorMessage";

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { error: null, hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { error, hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.log(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <ErrorMessage error={this.state.error} />;
        }

        return this.props.children;
    }
}
