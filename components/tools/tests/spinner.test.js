import React from 'react';
import { render } from 'enzyme';
import Spinner from '../Spinner';
import { expect } from 'chai';

describe('<Spinner />', () => {
  it('has .spinner-img-class className', () => {
    const wrapper = render(<Spinner />);
    expect(wrapper.find('.spinner-img-class')).to.have.lengthOf(1);
  });
});
