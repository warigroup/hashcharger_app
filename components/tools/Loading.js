import React, { useEffect } from 'react';
import Spinner2 from './Spinner2';
import { Router } from '../../routes';

const Loading = ({ profile }) => {
	useEffect(() => {
		if (profile === null || profile === '' || profile.username === '') {
			Router.pushRoute('/login');
		}
	}, []);

	return (
		<div>
			<br />
			<Spinner2 />
			<br />
		</div>
	);
};

export default Loading;
