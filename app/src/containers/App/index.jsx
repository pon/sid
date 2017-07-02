import React, {Component} from 'react';
import {Footer, Header} from '../../components';
import styled from 'styled-components';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

export class App extends Component {

  componentDidMount() {
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
