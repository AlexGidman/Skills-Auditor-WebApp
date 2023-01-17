import React, { ErrorInfo } from "react";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { error: undefined, hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { error, hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.log(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <ErrorMessage error={this.state.error} />;
        }

        return this.props.children;
    }
}
