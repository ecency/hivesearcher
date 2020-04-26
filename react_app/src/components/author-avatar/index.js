import React, {Component} from 'react';
import PropTypes from 'prop-types';

class AuthorAvatar extends Component {
    render() {
        const {user} = this.props;

        const imgSize = 'medium';
        const cls = `author-avatar`;

        return (
            <span
                className={cls}
                style={{
                    backgroundImage: `url('https://images.esteem.app/u/${user}/avatar/${imgSize}')`
                }}
            />
        );
    }
}

AuthorAvatar.propTypes = {
    user: PropTypes.string.isRequired,
};

export default AuthorAvatar