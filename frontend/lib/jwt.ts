import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET!

if (!SECRET) {
  throw new Error("Missing JWT_SECRET in env")
}

export function verifyJwt(token: string){
  return jwt.verify(token, SECRET)
}
