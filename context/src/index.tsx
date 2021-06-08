import React, { ComponentProps } from "react";
import ReactDOM from "react-dom";

const themes = {
  light: {
    color: "#000000",
    backgroundColor: "#eeeeee",
  },
  dark: {
    color: "#ffffff",
    backgroundColor: "#222222",
  },
};

type Theme = "light" | "dark";
interface ThemeContext {
  theme: Theme;
  toggle: () => void;
}
const ThemeContext = React.createContext<ThemeContext>({
  theme: "light",
  toggle: () => {},
});

namespace App {
  export type State = ThemeContext;
}
class App extends React.Component<{}, App.State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      theme: "light",
      toggle: this.toggleTheme.bind(this),
    };
  }

  toggleTheme(): void {
    this.setState((state) => ({
      theme: state.theme === "dark" ? "light" : "dark",
    }));
  }

  render(): React.ReactNode {
    return (
      <ThemeContext.Provider value={this.state}>
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

const Toolbar: React.FC = () => (
  <div>
    <ThemedButton>Button!</ThemedButton>
    <ThemeToggleButton />
  </div>
);

class ThemedButton extends React.Component {
  static contextType = ThemeContext;

  render(): React.ReactNode {
    return <Button theme={this.context.theme}>{this.props.children}</Button>;
  }
}

namespace Button {
  export type Props = ComponentProps<"button"> & {
    theme: Theme;
  };
}
const Button: React.FC<Button.Props> = ({ theme, ...props }) => (
  <button style={themes[theme]} {...props}>
    {props.children}
  </button>
);

const ThemeToggleButton: React.FC = () => (
  <ThemeContext.Consumer>
    {(context) => (
      <Button theme={context.theme} onClick={context.toggle}>
        Toggle
      </Button>
    )}
  </ThemeContext.Consumer>
);

ReactDOM.render(<App />, document.getElementById("root"));
