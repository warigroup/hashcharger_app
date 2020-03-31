import React from 'react';
import { render } from 'enzyme';
import Loading from '../Loading';
import { expect } from 'chai';
describe('<Loading />', () => {
  it('has two <br /> tags', () => {
    const wrapper = render(<Loading />);
    expect(wrapper.find('br')).to.have.lengthOf(2);
  });
});