import React, {Component} from 'react';
import {Footer, Header} from '../../components';
import styled from 'styled-components';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

export class App extends Component {

  componentWillMount() {
    injectTapEventPlugin();
  }

  render() {
    const ContentWrapper = styled.div`
      height: calc(100% - 90px);
      width: 100%;
      margin: 0 auto;
      overflow: scroll;
    `;

    const Wrapper = styled.div`
      height: 100%;
    `;

    return (
      <MuiThemeProvider>
        <Wrapper>
          <Header />
            <ContentWrapper>
              {this.props.children}
            </ContentWrapper>
          <Footer />
        </Wrapper>
      </MuiThemeProvider>
    );
  }
}

export default App
