import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
    useParams,
    useLocation,
    useHistory,
    useRouteMatch,
} from "react-router-dom";

// Hook
function useRouter() {
    const params = useParams();
    const location = useLocation();
    const history = useHistory();
    const match = useRouteMatch();
    // Return our custom router object
    // Memoize so that a new object is only returned if something changes
    return useMemo(() => {
        return {
            // For convenience add push(), replace(), pathname at top level
            push: history.push,
            replace: history.replace,
            pathname: location.pathname,
            // Include match, location, history objects so we have
            // access to extra React Router functionality if needed.
            match,
            location,
            history,
        };
    }, [params, match, location, history]);
}

export default useRouter;