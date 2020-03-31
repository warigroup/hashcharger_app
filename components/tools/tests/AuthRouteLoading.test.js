import React from 'react';
import { render } from 'enzyme';
import AuthRouteLoading from '../AuthRouteLoading';
import { expect } from 'chai';
describe('<AuthRouteLoading />', () => {
  it('has two <br /> tags ', () => {
    const wrapper = render(<AuthRouteLoading />);
    expect(wrapper.find('br')).to.have.lengthOf(2);
  });
});