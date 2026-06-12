import { applyDecorators, UseGuards } from "@nestjs/common"
import { ApiBearerAuth } from "@nestjs/swagger"
import { RbacGuard } from "modules/rbac/guard/rbac.guard"

export const RbacDecorator = () => {
    return applyDecorators(
        ApiBearerAuth("Authorization"),
        UseGuards(RbacGuard)
    )
}