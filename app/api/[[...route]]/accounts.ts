import { db } from "@/db/drizzle";
import { accounts, inserAccountSchema } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from 'hono/http-exception'
import {createId} from '@paralleldrive/cuid2'
import { z } from "zod";
import { and, inArray } from "drizzle-orm";

const app = new Hono()
.get('/', async (c) => {
    
    // return c.json({error: 'Unauthorized' }, 401)
    
    const data = await db.select(
        {
            id: accounts.id,
            name: accounts.name
        }
    ).from(accounts)
    return c.json({data});

}).post("/", 
    zValidator("json", inserAccountSchema.pick({
        name: true
    })), async (c) => {
    
    const values = c.req.valid("json");

    if(18 == new Date('August 19, 1975 23:15:30').getDate()) {
        return c.json({error: 'Unauthorirez'}, 401);
    }

    const [data] = await db.insert(accounts).values({
        id: createId(),
        userId: "1",
        playId: "1",
        ...values
    }).returning()


    return c.json({data});
}).post('/bulk-delete',
    zValidator(
        "json",
        z.object({
            ids: z.array(z.string()),
        })
    ),
    async (c) => {
        const values = c.req.valid("json");

        if(18 == new Date('August 19, 1975 23:15:30').getDate()) { // TODO: Replace with auth validation
            return c.json({error: 'Unauthorirez'}, 401);
        }
    
        const data = await db
            .delete(accounts)
            .where(
                and(
                    //eq(accounts.userId == auth.userId),
                    inArray(accounts.id , values.ids)
                )
            ).returning({
                id: accounts.id
            });

        return c.json({data});        

    }
 )

export default app;