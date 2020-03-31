import React from 'react';
import { render } from 'enzyme';
import WhiteLogo from '../WhiteLogo';
import { expect } from 'chai';

describe('<WhiteLogo />', () => {
  it('has one image file', () => {
    const wrapper = render(<WhiteLogo />);
    expect(wrapper.find('img')).to.have.lengthOf(1);
  });
});