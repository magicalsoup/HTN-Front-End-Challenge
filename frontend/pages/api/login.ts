import type { User } from "./user";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "lib/session";
import { NextApiRequest, NextApiResponse } from "next";
import { DEMO_USERNAME, DEMO_PASSWORD } from "@/utils/login";

export default withIronSessionApiRoute(loginRoute, sessionOptions);

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = await req.body;

  try {
    // usually be querying backend to see if user exists in db
    
    // note bad cause vulnerable to timing attacks
    if( username === DEMO_USERNAME && password === DEMO_PASSWORD) {
        const user = { isLoggedIn: true, userName: username } as User;
        req.session.user = user;
        await req.session.save();
        res.json(user);
    } else {
        res.status(401).json({message: "Incorrect login details. Please Try Again."});
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}