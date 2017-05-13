import React, {Component} from 'react';
import {Footer, Header} from '../../components';
import styled from 'styled-components';

export class App extends Component {
  render() {
    const ContentWrapper = styled.div`
      height: calc(100% - 112px);
      width: 500px;
      margin: 0 auto;
    `;

    const Wrapper = styled.div`
      height: 100%;
    `;

    return (
      <Wrapper>
        <Header />
          <ContentWrapper>
            {this.props.children}
          </ContentWrapper>
        <Footer />
      </Wrapper>
    );
  }
}

export default App
