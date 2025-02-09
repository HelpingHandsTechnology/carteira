import { _db } from "@/server/db"

export abstract class DbService {
  static readonly db = _db
}
