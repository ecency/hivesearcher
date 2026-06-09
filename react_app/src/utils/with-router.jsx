import React from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

// react-router v6 dropped the `history`/`location` props that v4 injected into
// route components. These screens are class components that still rely on
// `this.props.history.push(...)` and `this.props.location.search`, so this HOC
// reconstructs that minimal v4-shaped API from the v6 hooks.
export function withRouter(Component) {
    function ComponentWithRouter(props) {
        const navigate = useNavigate();
        const location = useLocation();
        const params = useParams();
        const history = {
            push: (to) => navigate(to),
            replace: (to) => navigate(to, { replace: true }),
            goBack: () => navigate(-1),
        };
        return (
            <Component
                {...props}
                navigate={navigate}
                history={history}
                location={location}
                params={params}
            />
        );
    }

    return ComponentWithRouter;
}

export default withRouter;
