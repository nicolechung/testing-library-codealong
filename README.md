## parcel setup

```
npm install -g parcel-bundler
```

# package.json setup

```
npm init -y
```

## react setup

```
npm install --save react
npm install --save react-dom
npm install --save-dev parcel-bundler
```

## template: index.html

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <div id="like_button_container"></div>
    <script src="./index.js"></script>
</body>
</html>
```

## template: index.js

```
import React from 'react'
import ReactDOM from 'react-dom'

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }

    return <button onClick={() => this.setState({ liked: true })}>Click me</button>
  }
}

const domContainer = document.querySelector('#like_button_container');
ReactDOM.render(<LikeButton />, domContainer);
```

## jest

```
npm install --save jest babel-jest @babel/preset-env @babel/preset-react react-test-renderer
```

## watch mode:

```
npm run test -- --watch
```

## testing library

```
npm install --save-dev @testing-library/react
npm install --save-dev @testing-library/jest-dom
```

## dev mode

```
parcel index.html
```

## prettier

```
npm install --save-dev --save-exact prettier
```
