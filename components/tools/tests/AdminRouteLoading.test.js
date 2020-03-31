import React from 'react';
import { render } from 'enzyme';
import AdminRouteLoading from '../AdminRouteLoading';
import { expect } from 'chai';
describe('<AdminRouteLoading />', () => {
  it('has two <br /> tags', () => {
    const wrapper = render(<AdminRouteLoading />);
    expect(wrapper.find('br')).to.have.lengthOf(2);
  });
});