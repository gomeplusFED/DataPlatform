/**
 * @author Mr.He
 * @date 20160511
 * @fileoverview 社交分析
 */

module.exports = {
    video() {
        return {
            name : "视频统计",
            path : "/videoStatis/video",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "播放统计",
                    query_api : "/videoStatis/videoOne"
                },
                {
                    type : "chart",
                    title : "播放趋势",
                    query_api : "/videoStatis/videoTwo"
                },
                {
                    type : "table",
                    title : "播放明细",
                    query_api : "/videoStatis/videoThree"
                },
            ]
        }
    },
    videoEdition() {
        return {
            name : "视频版本统计",
            path : "/videoStatis/edition",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title: "多端统计",
                    query_api : "/videoStatis/videoFour"
                }
            ]
        }
    }
};