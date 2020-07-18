import React from 'react';

export default () => {
	return (
		<span style={{ width: '100%', textAlign: 'center' }}>
			<img
				src="/static/spinner1.gif"
				style={{
					width: '90px',
					margin: 'auto',
					paddingTop: '70px',
					paddingBottom: '70px',
					display: 'block',
					opacity: '0.7'
				}}
				alt="Loading..."
			/>
		</span>
	);
};
