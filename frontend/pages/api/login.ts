import type { User } from "./user";

import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { NextApiRequest, NextApiResponse } from "next";

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = await req.body;

  try {
    // usually be querying backend to see if user exists in db
    
    // note bad cause vulnerable to timing attacks
    // also does not scale
    // console.log('api recieved', username, password);

    if( username === "test" && password === "password" ) {
        const user = { isLoggedIn: true } as User;
        req.session.user = user;
        await req.session.save();
        console.log("hello");
        res.json(user);
    } else {
        // should add resolved code here
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}