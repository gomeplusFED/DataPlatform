/**
 * @author yanglei
 * @date 20160628
 * @fileoverview
 */

module.exports = {
    id: { type: 'number', key: true },
    pid: Number,
    name: String,
    level: Number,
    status: Number,
    has_children: Number,
    has_spu: Number,
    created_at: Date,
    updated_at: Date,
    outer_id: String
};