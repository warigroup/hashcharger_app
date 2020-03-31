import React from 'react';
import { render, shallow } from 'enzyme';
import MaintenanceIndex from '../MaintenanceIndex';
import { expect } from 'chai';
describe('<MaintenanceIndex />', () => {
    it('renders required contents (static markups)', () => {
        const wrapper = render(<MaintenanceIndex />);
        expect(wrapper.find('br')).to.have.lengthOf(7);
        expect(wrapper.find('.display-5')).to.have.lengthOf(1);
        expect(wrapper.find('img')).to.have.lengthOf(1);
        expect(wrapper.find('.landing-texts')).to.have.lengthOf(1);
        expect(wrapper.find('.hreflink')).to.have.lengthOf(1);
    });

    it('renders required contents (shallow rendering)', () => {
        const wrapper = shallow(<MaintenanceIndex />);
        expect(wrapper.find('br')).to.have.lengthOf(7);
        expect(wrapper.find('.display-5')).to.have.lengthOf(1);
        expect(wrapper.find('img')).to.have.lengthOf(1);
        expect(wrapper.find('.landing-texts')).to.have.lengthOf(1);
        expect(wrapper.find('.hreflink')).to.have.lengthOf(1);
    });
});